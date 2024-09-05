package com.FreedomCollege.FreedomCollege.Config;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

public abstract class WebSecurityConfigAdapter {
    protected abstract void config(HttpSecurity http) throws Exception;
}
