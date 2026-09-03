function Image({ src, alt }) {
  return (
    <img
      className="post-image"
      src={src || "https://placehold.co/400x550?text=No+Cover"}
      alt={alt}
    />
  );
}

export default Image;
