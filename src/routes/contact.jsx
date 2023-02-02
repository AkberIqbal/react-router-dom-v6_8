import {
  Form,
  useLoaderData,
  useFetcher,
  /**
   * useFetcher hook: It allows us to communicate with loaders and actions
   * without causing a navigation.
   */
} from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function loader({ params }) {
  const contact = getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact;
}

export async function action({ request, params }) {
  let formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export default function Contact() {
  const contact = useLoaderData();
  console.log("Contact useLoaderData contact:", contact);
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placekitten.com/g/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img key={contact?.avatar} src={contact?.avatar || null} />
      </div>

      <div>
        <h1>
          {contact?.first || contact?.last ? (
            <>
              {contact?.first} {contact?.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact?.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact?.twitter}`}>
              {contact?.twitter}
            </a>
          </p>
        )}

        {contact?.notes && <p>{contact?.notes}</p>}

        <div>
          {/* this action value is important... this takes us to the /edit route */}
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            /* this action value is important... this takes us to the /destroy route */
            action="destroy"
            onSubmit={(event) => {
              /**
               * When the user clicks the submit button:
               * <Form> prevents the default browser behavior of sending a new POST request to the server,
               * but instead emulates the browser by creating a POST request with client side routing
               *
               * The <Form action="destroy"> matches the new route at "contacts/:contactId/destroy" and
               * sends it the request
               *
               * After the action redirects, React Router calls all of the loaders for the data on the page
               * to get the latest values (this is "revalidation"). useLoaderData returns new values and
               * causes the components to update!
               *
               * Add a form, add an action, React Router does the rest.
               */
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  // since we have a Form with method="post", this will call the action against this route
  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
