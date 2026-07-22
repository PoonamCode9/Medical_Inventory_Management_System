package com.medical.om.om_backend.security;

// Spring Security's interface we must implement
// It has exactly ONE method: loadUserByUsername()
import com.medical.om.om_backend.entity.Users;
import org.springframework.security.core.userdetails.UserDetailsService;

// Spring Security's ready-made UserDetails object — we'll build one of these
// using the data from our Users entity
import org.springframework.security.core.userdetails.UserDetails;

// This is the builder/wrapper Spring provides to create a UserDetails object easily
// It's named "User" but it's Spring's User, NOT your Users entity
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

// Thrown when Spring Security can't find the user by the given username
import org.springframework.security.core.userdetails.UsernameNotFoundException;

// Your own repository — the gateway to query the database
import com.medical.om.om_backend.repository.UserRepository;

// Marks this class as a Spring-managed component (like @Component but more specific)
// @Service signals this class contains business/service logic
import org.springframework.stereotype.Service;

// Marks this class as transactional — DB reads are wrapped in a transaction
// Good practice for any class that talks to the database
import org.springframework.transaction.annotation.Transactional;

// @Service — Spring creates one instance of this and keeps it in the application context
// @Transactional — wraps DB reads in a transaction so Hibernate doesn't complain
@Service
@Transactional
public class UserDetailsServiceImpl implements UserDetailsService {
    // implements UserDetailsService means we MUST provide loadUserByUsername()
    // Spring Security will call this method automatically when it needs to verify a user

    // Our bridge to the database — Spring injects this automatically
    private final UserRepository userRepository;

    // Constructor injection — Spring sees this constructor and automatically
    // passes in the UserRepository bean it already created
    // This is preferred over @Autowired on the field because it makes testing easier
    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // THE ONLY METHOD — loadUserByUsername()
    // Spring Security calls this automatically in two scenarios:
    //   1. During login: to find the user and check their password
    //   2. During request filtering: to load user details after validating the JWT
    // ─────────────────────────────────────────────────────────────────────────
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // Ask the repository to find the user by username in the database
        // findByUsername() returns an Optional<Users> — it might be empty if not found
        // orElseThrow() → if the Optional is empty, throw UsernameNotFoundException
        // Spring Security catches this exception and returns a 401 Unauthorized response
        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found with username: " + username
                ));

        // Now convert YOUR Users entity into Spring Security's UserDetails object
        // We use Spring's built-in User.builder() — a fluent builder pattern
        return User.builder()

                // .username() → sets the login identifier Spring will use
                .username(user.getUsername())

                // .password() → sets the BCrypt hashed password
                // Spring Security will compare the incoming password against this hash
                // IMPORTANT: this must be the HASHED version, never the raw password
                .password(user.getPassword())

                // Use the exact role name as the authority so hasAuthority("ADMIN") works
                .authorities(new SimpleGrantedAuthority(user.getRole().name()))

                // .build() creates the final immutable UserDetails object
                .build();
    }
}
