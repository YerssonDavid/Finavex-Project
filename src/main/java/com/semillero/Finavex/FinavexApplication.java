package com.semillero.Finavex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mail.MailSenderAutoConfiguration;

@SpringBootApplication(exclude = {MailSenderAutoConfiguration.class})
public class FinavexApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinavexApplication.class, args);
	}

}
