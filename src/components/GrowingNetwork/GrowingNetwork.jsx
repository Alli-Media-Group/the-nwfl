import './GrowingNetwork.scss';

/**
 * GrowingNetwork
 *
 * @param {string} bgImage  - blurred background image path
 * @param {Array}  cards    - [{ id, title, text, stripImage, stripAlt }]
 */
export default function GrowingNetwork({ bgImage, cards = [] }) {
  return (
    <section className="growing-network" aria-label="Join our growing network">

      {/* Blurred background */}
      <div className="growing-network__bg">
        {bgImage && <img src={bgImage} alt="" aria-hidden="true" />}
      </div>

      <div className="growing-network__inner">

        <h2 className="growing-network__heading">Join our growing network</h2>

        <div className="growing-network__grid">
          {cards.map((card) => (
            <div className="growing-network__card" key={card.id}>

              {/* Top — text */}
              <div className="growing-network__card-body">
                <h3 className="growing-network__card-title">{card.title}</h3>
                <p className="growing-network__card-text">{card.text}</p>
              </div>

              {/* Bottom — colored image strip */}
              <div className="growing-network__card-strip">
                <img src={card.stripImage} alt={card.stripAlt || card.title} />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
