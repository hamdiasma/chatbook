export const chekImage = (file) => {
  let err = "";
  if (!file) {
    err = "File does not exist!";
    return err;
  }
  if (file.size > 1024 * 1024) {
    err = "the file have a big size!";
    return err;
  }
  if (
    file.type !== "image/jpeg" &&
    file.type !== "image/jpg" &&
    file.type !== "image/png"
  ) {
    err = "Image format not correct!";
    return err;
  }
};

export const imageUploade = async (images) => {
  try {
    let imgArr = [];
    for (const item of images) {
      const formData = new FormData();
      if (item.camera) {
        formData.append("file", item.camera);
      } else {
        formData.append("file", item);
      }
      formData.append("upload_preset", "social-media");
      formData.append("cloud-name", "hamdi-ba");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/hamdi-ba/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      imgArr.push({
        public_id: data.public_id,
        url: data.secure_url,
      });
    }
    return imgArr;
  } catch (error) {}
};
