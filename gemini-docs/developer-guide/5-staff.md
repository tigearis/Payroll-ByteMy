
# Staff (Developer Guide)

This guide provides a technical overview of the staff section for developers.

## Key Components

*   `app/(dashboard)/staff/page.tsx`: The main page for the staff section. This component renders the `UserList` component.
*   `domains/users/components/user-list.tsx`: This component fetches a list of all users from the GraphQL API and displays them in a table.
*   `domains/users/components/user-form.tsx`: This component provides a form for adding and editing users.

## Data Fetching

The `UserList` component uses the `useQuery` hook to fetch a list of all users from the GraphQL API. The `GetUsersDocument` query is used for this purpose.

## Adding and Editing Users

The `UserForm` component uses the `useMutation` hook to add and edit users. The `CreateUserDocument` and `UpdateUserDocument` mutations are used for this purpose.

## Deleting Users

The `UserList` component uses the `useMutation` hook to delete users. The `DeleteUserDocument` mutation is used for this purpose.
