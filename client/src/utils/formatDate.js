// Using inbuilt Intl API, we can format dates. This will make it easier to understand for users.
const formatDate = date => {
  return new Intl.DateTimeFormat().format(new Date(date));
}

export default formatDate;
