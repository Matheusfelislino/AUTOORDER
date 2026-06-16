package com.autoorder;

import com.autoorder.translation.infrastructure.GroqProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(GroqProperties.class)
public class AutoorderApplication {

    public static void main(String[] args) {
        SpringApplication.run(AutoorderApplication.class, args);
    }
}
