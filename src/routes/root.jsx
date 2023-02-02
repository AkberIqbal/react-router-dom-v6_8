import {
  Outlet,
  useLoaderData,
  Form,
  NavLink,
  useNavigation,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

/* 
This is where the "old school web" programming model shows up. As we discussed earlier, 
<Form> prevents the browser from sending the request to the server and sends it to your
 route action instead. In web semantics, a POST usually means some data is changing. 
 By convention, React Router uses this as a hint to automatically revalidate the data 
 on the page after the action finishes. That means all of your useLoaderData hooks update
 and the UI stays in sync with your data automatically! Pretty cool.
*/
export async function action() {
  const contact = await createContact();
  console.log("Root action contact:", contact);
  return { contact };
}

export async function loader() {
  const contacts = await getContacts();
  console.log("loader contacts:", contacts);
  return { contacts };
}

export default function Root() {
  const { contacts } = useLoaderData();
  const navigation = useNavigation();
  console.log("navigation:", navigation);

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
