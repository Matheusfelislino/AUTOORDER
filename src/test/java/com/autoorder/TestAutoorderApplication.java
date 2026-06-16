package com.autoorder;

import org.springframework.boot.SpringApplication;

public class TestAutoorderApplication {

	public static void main(String[] args) {
		SpringApplication.from(AutoorderApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
