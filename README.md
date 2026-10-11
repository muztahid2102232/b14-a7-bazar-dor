# বাজার দর (BazarDor)

**বাজার দর --- প্রয়োজনীয় পণ্যের দামের এক নজরের ধারণা।**

BazarDor is a responsive market-price tracking web application focused
on everyday essentials in Bangladesh. It is designed to help users
compare today's prices with the previous day's prices, identify products
whose prices have increased or decreased, and explore prices across
different markets.

## Features

-   **Daily price movement:** Separate sections for products whose
    prices increased or decreased today compared with the previous day.
-   **Product catalogue:** Browse everyday essentials such as rice,
    lentils, fish, vegetables, eggs, butter, ginger, garlic, and more.
-   **Product detail pages:** Display product summaries, categories,
    units, minimum/maximum/average prices, and market-wise prices.
-   **Category browsing and sorting:** Browse products by category and
    sort by default order, lowest price, or highest price.
-   **Authentication:** Sign in and sign up with email/password, plus
    Google and GitHub social authentication through Better Auth.
-   **Protected product details:** Require login to access product
    detail pages.
-   **Profile updates:** Allow signed-in users to update their name.
-   **Price ticker:** Display a continuously scrolling ticker with
    product names, prices, and daily price changes.
-   **Responsive layout:** Support mobile, tablet, and desktop screens.
-   **Loading and feedback states:** Show loading skeletons while data
    is being fetched and toast notifications for authentication,
    validation, and relevant actions.
-   **Friendly 404 handling:** Show a helpful not-found page with a link
    back to the home page for invalid routes and unknown
    products/categories.

## Technology Stack

-   **Next.js** --- React framework for the web application.
-   **Next.js App Router** --- Routing and page navigation.
-   **TypeScript** --- Main application programming language.
-   **Tailwind CSS** --- Styling and responsive layouts.
-   **Better Auth** --- Authentication, planned for email/password and
    Google/GitHub providers.
-   **react-hot-toast** --- Toast notifications, if included in the
    implementation.
