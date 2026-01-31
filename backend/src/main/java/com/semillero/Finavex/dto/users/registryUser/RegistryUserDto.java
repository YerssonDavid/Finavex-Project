package com.semillero.Finavex.dto.users.registryUser;

public record RegistryUserDto(
        String name,
        String middleName,
        String surname,
        String secondSurname,
        String documentNumber,
        String dateOfBirth,
        String phone,
        String email,
        String password
) {
    public RegistryUserDto withEmail(String newEmail) {
        return new RegistryUserDto(
                name,
                middleName,
                surname,
                secondSurname,
                documentNumber,
                dateOfBirth,
                phone,
                newEmail,
                password
        );
    }

    public RegistryUserDto witchName(String newName) {
        return new RegistryUserDto(
                newName,
                middleName,
                surname,
                secondSurname,
                documentNumber,
                dateOfBirth,
                phone,
                email,
                password
        );
    }
}
