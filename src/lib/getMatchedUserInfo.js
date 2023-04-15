const getMatchedUserInfo = (users, usersLoggedIn) => {
  const newUsers = { ...users };
  delete newUsers[usersLoggedIn];
  const [id, user] = Object.entries(newUsers).flat();
  return { id, ...user };
};
export default getMatchedUserInfo;
