export function ArticleBodyForm() {
  return (
    <>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" />
      <label htmlFor="body">Body</label>
      <input type="text" id="body" name="body" />
    </>
  );
}