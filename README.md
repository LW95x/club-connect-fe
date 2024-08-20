## Hosted version

https://clubconnects.netlify.app/

## Frontend repository

https://github.com/LW95x/club-connect-fe/

## Description

- This frontend has been designed in combination with the Club Connect API to enable users to buy and sell tickets to events (matches), as a mediator to Non-League Football Clubs in the United Kingdom.
- There are two types of users on ClubConnect - fans and clubs - with clubs able to create new events to advertise to prospective fans. Fans are able to view these advertised events, and subsequently order tickets to these events.
- The project has been developed using Next.js in conjunction with the React framework, with TypeScript employed to ensure for type safety across all pages and components.
- The website has been styled using Bootstrap CSS, ensuring for a final design that is clean, fully responsive and adaptable to all devices.
- The Fetch API has been utilised to handle asynchronous requests to the hosted ClubConnect backend API.
- Lottie has been integrated to render loading animations for smoother transitions while navigating between pages.

## Cloning, Dependencies, Seeding, and Testing Instructions

Firstly, install all required dependencies with ```npm install```

Secondly, run the development server: ```npm run dev```

To build the production version of the website, you can run: ```npm run build```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result of the locally hosted version of the website.

## Dummy Accounts

Two user accounts have been registered for convenience, one for a "fan" user and one for a "club" user, if you would prefer to not to go through the registration process:

### Fan
Username: ```testfan```
Password: ```Testfan-123```

### Club
Username: ```testclub```
Password: ```Testclub-123```

## ClubConnect backend

https://github.com/LW95x/club-connect-be/

https://the-football-pyramid-backend.onrender.com/api/
