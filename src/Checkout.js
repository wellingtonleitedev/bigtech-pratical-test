import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useEffect, useState } from "react";

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  addProduct,
  removeProduct,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          className={styles.actionButton}
          disabled={orderedQuantity === availableCount}
          onClick={() => addProduct(id)}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          disabled={!orderedQuantity}
          onClick={() => removeProduct(id)}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [data, setData] = useState({
    products: [],
    loading: true,
  });

  const handleProducts = async () => {
    const response = await getProducts();

    const products = response.map(product => ({
      ...product,
      orderedQuantity: 0,
      total: 0,
    }));

    setData({ products, loading: false });
  };

  const applyDiscount = (product) => {
    if (product.total > 1000) {
      const totalWithDiscount = product.total - (product.total * 10) / 100;

      Object.assign(product, {
        total: totalWithDiscount,
      });
    }
  }

  const addProduct = (id) => {
    const index = data.products.findIndex((item) => item.id === id);

    let newProducts = data.products;

    const product = newProducts[index];

    Object.assign(product, {
      orderedQuantity: product.orderedQuantity + 1,
      total: product.price * (product.orderedQuantity + 1),
    });

    applyDiscount(product);

    setData({ loading: false, products: newProducts });
  };

  const removeProduct = (id) => {
    const index = data.products.findIndex((item) => item.id === id);

    let newProducts = data.products;

    const product = newProducts[index];

    Object.assign(product, {
      orderedQuantity: product.orderedQuantity - 1,
      total: product.price * (product.orderedQuantity - 1),
    });

    applyDiscount(product);

    setData({ loading: false, products: newProducts });
  };

  const total = data.products.reduce((acumulate, product) => acumulate + product.total, 0);

  useEffect(() => {
    handleProducts();
  }, []);

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {data.loading && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product) => (
              <Product
                key={product.id}
                addProduct={addProduct}
                removeProduct={removeProduct}
                {...product}
              />
            ))}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ </p>
        <p>Total: ${total} </p>
      </main>
    </div>
  );
};

export default Checkout;
