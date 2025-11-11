package com.semillero.Finavex.config.swagger;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                title = "Finavex API - semillero",
                description = "APIS for management of personal finances",
                version = "V0.0.1",
                contact = @Contact (
                        name = "Email of the developer",
                        email = "david222.developer@gmail.com"
                ),
                license = @License(
                        name = "GNU Affero General Public License v3.0",
                        url = "https://github.com/YerssonDavid/Finavex-Project/blob/main/LICENSE"
                ),
                summary = "Official finavex documentation of the APIs developed in the project, allowing connection and interaction with the database, as well as user management"
        ),
        servers = {
                @Server(
                        description = "Local Server",
                        url = "http://localhost:8080"
                )
        }
)
public class swaggerConf {}
