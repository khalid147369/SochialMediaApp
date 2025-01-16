import cookie from 'universal-cookie';

const cookies = new cookie();

export const handleImage = (url, setImage) => {
  console.log(url);
  setImage(url);
};

export const handleSubmit = async (sendPost, description, image, setDescription, setImage, posts) => {
  const token = cookies.get("token");
  const { data } = await sendPost(token, description, image);
  if (data.status === 200) {
    setDescription("");
    setImage(null);
    console.log(posts);
  }
};
