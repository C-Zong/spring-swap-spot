package com.cyanzone.swapspot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.cyanzone.swapspot.mapper")
public class SwapspotApplication {

    public static void main(String[] args) {
        SpringApplication.run(SwapspotApplication.class, args);
    }

}
