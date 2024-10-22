export const shortened_url = (u) => {
  // try to do minimal alterations, just get rid of www currently
  try {
    let s = u.split(".");

    if (s[0] == "www") {
      s.splice(0, 1);
    }
    return s.join(".");
  } catch (err) {
    console.error(JSON.stringify(u));
  }
};
