import './NewsLetter.scss';

const Newsletter = () => {
  return (
    <section className="newsletter" aria-label="Newsletter">
      <h2 className="newsletter__heading">Sporty stuff only</h2>
      <p className="newsletter__sub">
        Subscribe to our newsletter:&nbsp;
        <a href="mailto:yourname@email.com" className="newsletter__email">
          yourname@email.com
        </a>
      </p>
    </section>
  );
};

export default Newsletter;
