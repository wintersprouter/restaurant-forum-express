upload_img.onchange = evt => {
  const [file] = upload_img.files
  if (file) {
    blah.src = URL.createObjectURL(file)
  }
}