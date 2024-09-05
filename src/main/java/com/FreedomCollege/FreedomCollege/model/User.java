package com.FreedomCollege.FreedomCollege.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "\"User\"")
public class User {

    @Id
    private Long id;
    private String password;
    private String username;
    private String Role;

    public User(){}

    public String getUsername() {
        return username;
    }
public String getPassword() {
        return password;
    }
public Long getId() {
        return id;
}
public String getRole() {
        return Role;
}

}
