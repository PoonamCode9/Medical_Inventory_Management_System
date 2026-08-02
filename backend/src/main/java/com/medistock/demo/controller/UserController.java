package com.medistock.demo.controller;


import com.medistock.demo.dto.*;
import com.medistock.demo.entity.Role;
import com.medistock.demo.entity.User;
import com.medistock.demo.repository.RoleRepository;
import com.medistock.demo.repository.UserRepository;
import com.medistock.demo.service.JwtService;


import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Locale;



@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins="http://localhost:3000")
public class UserController {



    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;



    public UserController(

            UserRepository userRepository,

            RoleRepository roleRepository,

            PasswordEncoder passwordEncoder,

            JwtService jwtService

    ){

        this.userRepository=userRepository;

        this.roleRepository=roleRepository;

        this.passwordEncoder=passwordEncoder;

        this.jwtService=jwtService;

    }






// =================================================
// GET ALL USERS
// =================================================


@GetMapping
public ResponseEntity<List<User>> getAllUsers(){


    List<User> users=userRepository.findAll();


    users.forEach(
            user -> user.setPassword(null)
    );


    return ResponseEntity.ok(users);

}








// =================================================
// ADD USER
// =================================================


@PostMapping
public ResponseEntity<?> addUser(
        @RequestBody CreateUserRequest request
){


    try{


        if(userRepository.findByUsername(
                request.getUsername()
        ).isPresent()){

            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");

        }




        if(userRepository.findByEmail(
                request.getEmail()
        ).isPresent()){

            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");

        }




        Role role =
                roleRepository.findByRoleName(
                        request.getRole()
                                .toUpperCase(Locale.ROOT)
                )
                .orElseThrow(
                        ()->new RuntimeException(
                                "Role not found"
                        )
                );



        User user=new User();


        user.setFullName(
                request.getFullName()
        );


        user.setUsername(
                request.getUsername()
        );


        user.setEmail(
                request.getEmail()
        );


        user.setPhone(
                request.getPhone()
        );


        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setRole(role);



        User saved=userRepository.save(user);


        saved.setPassword(null);


        return ResponseEntity.ok(saved);


    }
    catch(Exception e){

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    }

}









// =================================================
// PROFILE
// =================================================


@GetMapping("/profile")
public ResponseEntity<User> profile(

        @RequestHeader("Authorization")
        String header

){


    User user=getUserFromToken(header);


    user.setPassword(null);


    return ResponseEntity.ok(user);

}









// =================================================
// UPDATE OWN PROFILE
// =================================================


@PutMapping("/update-profile")
public ResponseEntity<?> updateProfile(

        @RequestHeader("Authorization")
        String header,

        @RequestBody UpdateProfileRequest request

){


    try{


        User user=getUserFromToken(header);



        user.setFullName(
                request.getFullName()
        );


        user.setPhone(
                request.getPhone()
        );



        User saved=userRepository.save(user);


        saved.setPassword(null);



        return ResponseEntity.ok(saved);



    }
    catch(Exception e){

        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    }


}









// =================================================
// CHANGE PASSWORD
// =================================================


@PutMapping("/change-password")
public ResponseEntity<?> changePassword(

        @RequestHeader("Authorization")
        String header,

        @RequestBody ChangePasswordRequest request

){


    try{


        User user=getUserFromToken(header);



        if(!passwordEncoder.matches(

                request.getOldPassword(),

                user.getPassword()

        )){


            return ResponseEntity
                    .badRequest()
                    .body(
                            "Old password incorrect"
                    );

        }




        user.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()
                )

        );



        userRepository.save(user);



        return ResponseEntity.ok(
                "Password changed successfully"
        );



    }
    catch(Exception e){


        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    }


}









// =================================================
// UPDATE USER BY ADMIN
// =================================================


@PutMapping("/{id}")
public ResponseEntity<?> updateUser(

        @PathVariable Long id,

        @RequestBody UpdateUserRequest request

){


    try{


        User user=userRepository.findById(id)

                .orElseThrow(
                        ()->new RuntimeException(
                                "User not found"
                        )
                );



        user.setFullName(
                request.getFullName()
        );


        user.setUsername(
                request.getUsername()
        );


        user.setEmail(
                request.getEmail()
        );


        user.setPhone(
                request.getPhone()
        );




        if(request.getPassword()!=null &&
                !request.getPassword().isBlank()){


            user.setPassword(

                    passwordEncoder.encode(
                            request.getPassword()
                    )

            );

        }




        if(request.getRole()!=null){


            Role role=
                    roleRepository.findByRoleName(

                            request.getRole()
                                    .toUpperCase(Locale.ROOT)

                    )
                    .orElseThrow(
                            ()->new RuntimeException(
                                    "Role not found"
                            )
                    );


            user.setRole(role);


        }




        User saved=userRepository.save(user);


        saved.setPassword(null);


        return ResponseEntity.ok(saved);



    }
    catch(Exception e){


        return ResponseEntity
                .badRequest()
                .body(e.getMessage());

    }


}









// =================================================
// DELETE USER
// =================================================


@DeleteMapping("/{id}")
public ResponseEntity<?> deleteUser(

        @PathVariable Long id

){


    if(!userRepository.existsById(id)){


        return ResponseEntity
                .badRequest()
                .body(
                        "User not found"
                );

    }



    userRepository.deleteById(id);



    return ResponseEntity.ok(
            "User deleted successfully"
    );


}










// =================================================
// GET USER FROM JWT
// =================================================


private User getUserFromToken(String header){


    if(header==null ||
            !header.startsWith("Bearer ")){

        throw new RuntimeException(
                "Invalid token"
        );

    }



    String token=header.substring(7);



    String email=
            jwtService.extractEmail(token);



    return userRepository.findByEmail(email)

            .orElseThrow(
                    ()->new RuntimeException(
                            "User not found"
                    )
            );


}



}