# FindMyRoomie – Roommate & Housing Platform

FindMyRoomie is a full-stack web application designed to help students and working professionals discover suitable roommate and shared-housing listings based on their preferred location and requirements.

Users can register, log in, create lifestyle-aware profiles, search for housing listings by location, view listing details, and contact the listing owner using the provided phone number or email address.

[![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=20232a)](frontend/)
[![Backend](https://img.shields.io/badge/backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)](backend/)
[![Database](https://img.shields.io/badge/database-MySQL-4479A1?logo=mysql&logoColor=white)](backend/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

FindMyRoomie is an open-source project for developers, designers, and housing communities. Fork it, study it, improve it, and share modified versions under the [MIT License](LICENSE). The FindMyRoomie name, logo, and other branding remain separate from the code license and must not be used to imply official affiliation or endorsement.

Project policies: [Contributing](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Security](SECURITY.md)

## Why FindMyRoomie

People spend a remarkable part of their day at home with the person they live with. A roommate affects sleep, work, privacy, cleanliness, finances, guests, routines, and the emotional feel of home. Yet most housing platforms optimize for the room or property first and leave compatibility to chance.

FindMyRoomie puts the human fit at the center. It gives people a place to describe how they live, discover rooms and potential roommates in their city, understand lifestyle preferences before reaching out, and start a direct conversation before making a commitment.

## Problem Statement

Finding housing is already difficult. Finding a compatible roommate is a separate, under-served problem:

- Property listings reveal space, price, and location, but rarely the habits of the people sharing it.
- Social platforms offer conversations, but not a structured housing context.
- People often discover incompatibilities only after moving in together.
- Important signals such as smoking, drinking, sleep schedule, occupation, budget, and move-in timing are difficult to compare quickly.
- A promising connection can be lost when there is no simple path from discovery to a private conversation.

**FindMyRoomie addresses this gap by combining room discovery, lifestyle context, profile information, and real-time messaging in one focused workflow.**

## Features

- User registration and login
- Basic email-and-password authentication
- Password hashing using BCrypt
- User profile management
- Location-based housing search
- Property/room listing management
- Search listings by location
- Lifestyle-aware user profiles
- Listing owner contact information
- REST API-based frontend and backend communication

## Lifestyle-Aware Profiles

Users can provide information that helps them find more suitable roommate or housing options:

- Location
- Budget
- Move-in date
- Occupation
- Smoking preference
- Drinking preference
- Sleep schedule
- Bio

## Technology Stack

### Frontend

- React.js
- Vite 7

### Backend

- Java
- Spring Boot
- Spring Data JPA
- Hibernate
- REST APIs
- BCrypt for password hashing

### Database

- MySQL

## System Architecture

```text
                    FindMyRoomie
                         |
             +-----------+-----------+
             |                       |
             v                       v
       React Frontend         Spring Boot Backend
             |                       |
             |       REST APIs        |
             +-----------+-----------+
                         |
                         v
                  Spring Data JPA
                         |
                         v
                      MySQL
