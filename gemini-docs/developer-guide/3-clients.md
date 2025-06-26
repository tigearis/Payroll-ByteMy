
# Clients (Developer Guide)

This guide provides a technical overview of the clients section for developers.

## Key Components

*   `app/(dashboard)/clients/page.tsx`: The main page for the clients section. This component renders the `ClientList` component.
*   `domains/clients/components/client-list.tsx`: This component fetches a list of all clients from the GraphQL API and displays them in a table.
*   `domains/clients/components/client-form.tsx`: This component provides a form for adding and editing clients.

## Data Fetching

The `ClientList` component uses the `useQuery` hook to fetch a list of all clients from the GraphQL API. The `GetClientsDocument` query is used for this purpose.

## Adding and Editing Clients

The `ClientForm` component uses the `useMutation` hook to add and edit clients. The `CreateClientDocument` and `UpdateClientDocument` mutations are used for this purpose.

## Deleting Clients

The `ClientList` component uses the `useMutation` hook to delete clients. The `DeleteClientDocument` mutation is used for this purpose.
