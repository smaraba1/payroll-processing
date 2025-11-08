package com.company.ems.config;

import com.company.ems.domain.User;
import com.company.ems.domain.UserRole;
import com.company.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Create default admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = User.builder()
                    .email("admin@example.com")
                    .hashedPassword(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .role(UserRole.ROLE_ADMIN)
                    .isActive(true)
                    .build();

            userRepository.save(admin);
            log.info("Default admin user created: admin@example.com / admin123");
        } else {
            // Update existing admin user with correct password hash
            userRepository.findByEmail("admin@example.com").ifPresent(user -> {
                String correctHash = passwordEncoder.encode("admin123");
                user.setHashedPassword(correctHash);
                user.setIsActive(true);
                userRepository.save(user);
                log.info("Admin user password updated: admin@example.com / admin123");
            });
        }
    }
}

