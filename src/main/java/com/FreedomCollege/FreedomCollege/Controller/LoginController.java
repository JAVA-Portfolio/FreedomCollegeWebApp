package com.FreedomCollege.FreedomCollege.Controller;

import ch.qos.logback.core.model.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    //this will return the html login page.
    // referemce path to access login page /login
    @GetMapping("/login")
    public String login() {
        return "Login";
    }

}
