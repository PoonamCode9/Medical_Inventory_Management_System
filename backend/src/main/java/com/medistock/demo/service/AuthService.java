package com.medistock.demo.service;


import com.medistock.demo.dto.AuthResponse;
import com.medistock.demo.dto.LoginRequest;
import com.medistock.demo.dto.RegisterRequest;
import com.medistock.demo.entity.Role;
import com.medistock.demo.entity.User;
import com.medistock.demo.repository.RoleRepository;
import com.medistock.demo.repository.UserRepository;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Locale;



@Service
public class AuthService {



    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;



    // =====================================================
    // SECRET CODES FROM APPLICATION.PROPERTIES
    // =====================================================


    @Value("${admin.secret.id}")
    private String adminSecretId;


    @Value("${pharmacist.secret.code}")
    private String pharmacistSecret;


    @Value("${staff.secret.code}")
    private String staffSecret;





    // =====================================================
    // CONSTRUCTOR
    // =====================================================


    public AuthService(

            UserRepository userRepository,

            RoleRepository roleRepository,

            JwtService jwtService,

            PasswordEncoder passwordEncoder

    ){

        this.userRepository = userRepository;

        this.roleRepository = roleRepository;

        this.jwtService = jwtService;

        this.passwordEncoder = passwordEncoder;

    }






    // =====================================================
    // REGISTER USER
    // =====================================================


    public AuthResponse register(
            RegisterRequest req
    ){



        validateRegisterRequest(req);



        String email =
                req.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT);




        // CHECK EMAIL


        if(
                userRepository
                .findByEmail(email)
                .isPresent()
        ){

            throw new RuntimeException(
                    "Email already registered"
            );

        }




        // FIND ROLE


        Role role =
                roleRepository
                .findByRoleName(
                        req.getRole()
                        .trim()
                        .toUpperCase(Locale.ROOT)
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid role"
                        )
                );






        // CREATE USER


        User user = new User();


        user.setUsername(
                req.getUsername()
        );


        user.setFullName(
                req.getFullName()
        );


        user.setEmail(
                email
        );


        user.setPhone(
                req.getPhone()
        );



        user.setPassword(

                passwordEncoder.encode(
                        req.getPassword()
                )

        );



        user.setRole(
                role
        );





        User savedUser =
                userRepository.save(user);







        // CREATE JWT


        String token =
                jwtService.generateToken(

                        savedUser.getEmail(),

                        role.getRoleName()
                                .toUpperCase(Locale.ROOT)

                );





        return new AuthResponse(

                token,

                role.getRoleName()
                        .toUpperCase(Locale.ROOT),

                savedUser.getId()

        );



    }









    // =====================================================
    // LOGIN USER
    // =====================================================


    public AuthResponse login(
            LoginRequest req
    ){



        if(
                req.getEmail()==null
                ||
                req.getEmail().isBlank()
        ){

            throw new RuntimeException(
                    "Email required"
            );

        }




        if(
                req.getPassword()==null
                ||
                req.getPassword().isBlank()
        ){

            throw new RuntimeException(
                    "Password required"
            );

        }





        User user =

                userRepository
                .findByEmail(
                        req.getEmail()
                        .trim()
                        .toLowerCase(Locale.ROOT)
                )

                .orElseThrow(() ->

                        new RuntimeException(
                                "User not found"
                        )

                );







        if(user.getRole()==null){


            throw new RuntimeException(
                    "User role not assigned"
            );

        }







        String role =

                user.getRole()
                .getRoleName()
                .trim()
                .toUpperCase(Locale.ROOT);







        System.out.println(
                "================================"
        );

        System.out.println(
                "LOGIN EMAIL : "
                + user.getEmail()
        );


        System.out.println(
                "LOGIN ROLE  : "
                + role
        );


        System.out.println(
                "================================"
        );









        // =====================================================
        // SECRET CODE CHECK
        // =====================================================


        validateSecretCode(
                role,
                req.getSecretCode()
        );







        // =====================================================
        // PASSWORD CHECK
        // =====================================================


        if(
                !passwordEncoder.matches(

                        req.getPassword(),

                        user.getPassword()

                )
        ){


            throw new RuntimeException(
                    "Invalid password"
            );


        }







        // =====================================================
        // GENERATE TOKEN
        // =====================================================


        String token =

                jwtService.generateToken(

                        user.getEmail(),

                        role

                );








        return new AuthResponse(

                token,

                role,

                user.getId()

        );



    }









    // =====================================================
    // VALIDATE REGISTER REQUEST
    // =====================================================


    private void validateRegisterRequest(
            RegisterRequest req
    ){


        if(
                req.getEmail()==null
                ||
                req.getEmail().isBlank()
        ){

            throw new RuntimeException(
                    "Email required"
            );

        }



        if(
                req.getPassword()==null
                ||
                req.getPassword().isBlank()
        ){

            throw new RuntimeException(
                    "Password required"
            );

        }



        if(
                req.getRole()==null
                ||
                req.getRole().isBlank()
        ){

            throw new RuntimeException(
                    "Role required"
            );

        }



    }









    // =====================================================
    // SECRET VALIDATION
    // =====================================================


    private void validateSecretCode(

            String role,

            String secret

    ){



        if(
                secret==null
                ||
                secret.isBlank()
        ){

            throw new RuntimeException(
                    role +
                    " Secret Code required"
            );

        }





        String entered =
                secret.trim();




        switch(role){



            case "ADMIN":


                if(
                    !entered.equals(
                            adminSecretId.trim()
                    )
                ){

                    throw new RuntimeException(
                            "Invalid Admin Secret Code"
                    );

                }


                break;






            case "PHARMACIST":


                if(
                    !entered.equals(
                            pharmacistSecret.trim()
                    )
                ){

                    throw new RuntimeException(
                            "Invalid Pharmacist Secret Code"
                    );

                }


                break;







            case "STAFF":


                if(
                    !entered.equals(
                            staffSecret.trim()
                    )
                ){

                    throw new RuntimeException(
                            "Invalid Staff Secret Code"
                    );

                }


                break;







            default:


                throw new RuntimeException(
                        "Unknown Role"
                );


        }



    }



}