package com.tientoan21.hrm;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class HrmApplication {
	public static void main(String[] args) {
		// Đọc file .env
		Dotenv dotenv = Dotenv.load();

		// Nạp các biến trong file .env vào System Properties để Spring có thể hiểu được
		dotenv.entries().forEach(entry ->
				System.setProperty(entry.getKey(), entry.getValue())
		);
		SpringApplication.run(HrmApplication.class, args);
	}

}
