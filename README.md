## Location Flow Project README

This is a **Location Flow** project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Cloning the Repository

1. Open your terminal.
2. Clone the repository using the following command:

   ```bash
   git clone https://github.com/ayush-sharaf/location-flow.git
   ```

3. Navigate into the project directory:

   ```bash
   cd location-flow
   ```

### Installing Dependencies

Before running the development server, you need to install the required dependencies. Run:

```bash
npm install
```

### Running the Development Server

Now, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Features

- **Location Access**: Requests permission to access the user's location or allows manual location search.
- **Google Maps Integration**: Utilizes Google Maps API to fetch map details and coordinates.
- **Location Management**: Users can save, delete, and manage locations through a form.
- **Favorites**: Additional feature to save addresses as favorites.

## Environment Variables

Create a `.env` file in the root of your project and add the following variable:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual Google Maps API key.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
