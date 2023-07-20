# Project ATLAS HRMS

This is the repository for the HRMS used by ATLAS which is used by the whole NUS Fintech Society.

## Tech Stack

1. Cloud Firestore
2. Firebase Authentication
3. Tailwind
4. TRPC
5. Chakra UI
6. NextJS

## Getting Started

1. Ensure that you have the updated `.env` file and that you are added to the Firebase Project. Contact the Tech Lead to do so.
2. Install the necessary dependencies using the following command. Please do not use npm.

```bash
yarn install
```

## How can I contribute

### Backend

1. We will be following structure. Under `/src/server/trpc/router/controllers` under the corresponding feature directory, create the corresponding controller with the neccessary methods. We are using OOP for abstraction and encapsulation.

2. Write unit tests for the following code under `/test/trpc/router/controllers`.

3. Execute the following command to ensure that the unit test works.

```bash
yarn test
```

You need to have Java 11 to open the emulator.

### Prior to Pull Request

1.Make sure your code can build by running

```bash
yarn build
```

2. Ensure that all unit tests passes.

```bash
yarn test
```
