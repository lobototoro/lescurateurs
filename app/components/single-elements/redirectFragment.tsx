export const RedirectFragment = ({ url }: { url: string }) => {
  return (
    <div>
      <h1>Redirecting...</h1>
      <p>
        If you are not redirected automatically, follow this{' '}
        <a href={url}>link</a>.
      </p>
      <script>
        {`setTimeout(function() {
          window.location.href = '${url}';
        }, 1000);`}
      </script>
    </div>
  );
};
