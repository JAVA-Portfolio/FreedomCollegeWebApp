package com.FreedomCollege.FreedomCollege.Service;

import com.FreedomCollege.FreedomCollege.model.User;
import com.FreedomCollege.FreedomCollege.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.logging.Logger;
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger LOGGER = Logger.getLogger(CustomUserDetailsService.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LOGGER.info("Attempting to load user by username: " + username);

        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            LOGGER.warning("User not found: " + username);
            throw new UsernameNotFoundException("User not found");
        }

        User user = userOptional.get();
        LOGGER.info("User found: " + user.getUsername());

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
