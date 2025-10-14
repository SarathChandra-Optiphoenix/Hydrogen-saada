// app/components/CartLineItem.jsx
import {CartForm, Image, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';

export function CartLineItem({ line}) {
  const {id, merchandise, quantity} = line;

  if (!merchandise?.product) return null;

  return (
    <li key={id} className="cart-line">
      {merchandise.image && (
        <Image
          alt={merchandise.title}
          aspectRatio="1/1"
          data={merchandise.image}
          height={100}
          loading="lazy"
          width={100}
          className="cart-line-img"
        />
      )}

      <div className="cart-line-info">
        <Link
          prefetch="intent"
          to={`/products/${merchandise.product.handle}`}
          className="cart-line-title"
        >
          <p>
            <strong>{merchandise.product.title}</strong>
          </p>
        </Link>

        <div className="cart-line-row">
          <Money data={line.cost.totalAmount} className="price-now" />
          {line.cost.compareAtAmountPerQuantity && (
            <Money data={line.cost.compareAtAmountPerQuantity} className="price-mrp" />
          )}
        </div>

        {merchandise.selectedOptions && (
          <ul className="cart-line-opts">
            {merchandise.selectedOptions.map((option) => (
              <li key={option.name}>
                <small>
                  {option.name}: {option.value}
                </small>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-line-qty">
          <ItemRemoveButton lineId={id} />
          <small className="qty-val">{quantity}</small>
          <UpdateButton lines={[{id, quantity: quantity + 1}]}>
            <button className="qty-btn" type="submit" aria-label="Increase quantity">
              +
            </button>
          </UpdateButton>
        </div>
      </div>
    </li>
  );
}

function ItemRemoveButton({lineId}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds: [lineId]}}
    >
      <button className="qty-btn" type="submit" aria-label="Remove item">
        -
      </button>
    </CartForm>
  );
}

function UpdateButton({lines, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}