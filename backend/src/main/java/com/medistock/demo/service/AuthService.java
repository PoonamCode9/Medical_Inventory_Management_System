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



    // ================= SECRET CODES =================


    @Value("${admin.secret.id}")
    private String adminSecretId;


    @Value("${pharmacist.secret.code}")
    private String pharmacistSecret;


    @Value("${staff.secret.code}")
    private String staffSecret;




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





    // ================= REGISTER =================


    public AuthResponse register(RegisterRequest req) {


        if(req.getEmail()==null || req.getEmail().isBlank()){

            throw new RuntimeException(
                    "Email is required"
            );

        }



        if(req.getPassword()==null || req.getPassword().isBlank()){

            throw new RuntimeException(
                    "Password is required"
            );

        }



        if(req.getRole()==null || req.getRole().isBlank()){

            throw new RuntimeException(
                    "Role is required"
            );

        }



        if(userRepository.findByEmail(req.getEmail()).isPresent()){

            throw new RuntimeException(
                    "Email already registered"
            );

        }



        Role role = roleRepository.findByRoleName(
                req.getRole()
                        .toUpperCase(Locale.ROOT)
        )
        .orElseThrow(() ->
                new RuntimeException(
                        "Role not found"
                )
        );




        User user = new User();


        user.setUsername(req.getUsername());

        user.setFullName(req.getFullName());

        user.setEmail(req.getEmail());

        user.setPhone(req.getPhone());


        user.setPassword(
                passwordEncoder.encode(
                        req.getPassword()
                )
        );


        user.setRole(role);



        userRepository.save(user);




        String token = jwtService.generateToken(
                user.getEmail(),
                role.getRoleName()
                        .toUpperCase(Locale.ROOT)
        );




        return new AuthResponse(

                token,

                role.getRoleName()
                        .toUpperCase(Locale.ROOT),

                user.getId()

        );

    }









    // ================= LOGIN =================


    public AuthResponse login(LoginRequest req) {



        User user = userRepository.findByEmail(
                req.getEmail()
        )
        .orElseThrow(() ->
                new RuntimeException(
                        "User not found"
                )
        );




        if(user.getRole()==null){

            throw new RuntimeException(
                    "User role missing"
            );

        }




        String userRole = user.getRole()
                .getRoleName()
                .trim()
                .toUpperCase(Locale.ROOT);





        System.out.println("======================");
        System.out.println("LOGIN USER : " + user.getEmail());
        System.out.println("ROLE       : " + userRole);
        System.out.println("INPUT CODE : " + req.getSecretCode());
        System.out.println("======================");







        // ================= SECRET VALIDATION =================


        if(req.getSecretCode()==null ||
                req.getSecretCode().isBlank()){


            throw new RuntimeException(
                    userRole + " Secret Code required"
            );

        }





        switch(userRole){



            case "ADMIN":


                if(!req.getSecretCode()
                        .trim()
                        .equals(adminSecretId.trim())){


                    throw new RuntimeException(
                            "Invalid Admin Secret Code"
                    );

                }


                break;





            case "PHARMACIST":


                if(!req.getSecretCode()
                        .trim()
                        .equals(pharmacistSecret.trim())){


                    throw new RuntimeException(
                            "Invalid Pharmacist Secret Code"
                    );

                }


                break;






            case "STAFF":


                if(!req.getSecretCode()
                        .trim()
                        .equals(staffSecret.trim())){


                    throw new RuntimeException(
                            "Invalid Staff Secret Code"
                    );

                }


                break;






            default:


                throw new RuntimeException(
                        "Invalid Role : " + userRole
                );


        }







        // ================= PASSWORD CHECK =================



        if(!passwordEncoder.matches(

                req.getPassword(),

                user.getPassword()

        )){


            throw new RuntimeException(
                    "Invalid Password"
            );


        }







        // ================= JWT GENERATION =================



        String token = jwtService.generateToken(

                user.getEmail(),

                userRole

        );







        return new AuthResponse(

                token,

                userRole,

                user.getId()

        );


    }



}