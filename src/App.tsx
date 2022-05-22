import React, { useState, useRef, useLayoutEffect } from "react";
import "./App.css";
import { IProduct } from "./Interface/IProduct";
import { useSelector, useDispatch } from "react-redux";
import { productActions, cartActions, featuredProduct } from "./store/index";
import useCheckMobile from "./hooks/useCheckMobile";
import NavBar from "./components/NavBar/NavBar";
import FeaturedProduct from "./components/FeaturedProduct/FeaturedProduct";
import FeaturedProductDetails from "./components/FeaturedProductDetails/FeaturedProductDetails";
import ProductList from "./components/ProductList/ProductList";

function App() {
  const firstRender = useRef(true);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state.cart.cart);
  const [cartShow, setCartShow] = useState(false);
  const handleClose = () => setCartShow(false);
  const handleShow = () => setCartShow(true);
  const [filterSettings, setFilterSettings] = useState(false);
  let limit = useCheckMobile() ? 4 : 6;
  let productsPerPage = useSelector((state: any) => state.product.productsPerPage);
  function dispatchCart(product: IProduct) {
    dispatch(cartActions.addToCart(product));
    handleShow();
  }
  function removeItemsFromCart() {
    dispatch(cartActions.removeFromCart());
    handleClose();
  }
  function addFeaturedProductToCart() {
    dispatchCart(featuredProduct);
  }
  function setFilterSettingsHandler() {
    setFilterSettings(!filterSettings);
  }
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      dispatch(productActions.setLimit({limit: limit}));
      dispatch(productActions.paginateProducts({page:1}));
    } else if (!firstRender.current && cartItems?.length > 0) {
      handleShow();
    }
  }, [cartItems]);

  return (
    <div className="container container-fluid py-3">
      {/* NavBar  */}
      <NavBar
        cartItems={cartItems}
        onShowModal={handleShow}
        onHideModal={handleClose}
        onRemoveItemsFromCart={removeItemsFromCart}
        cartShow={cartShow}
      />

      {/* Featured product */}
      <FeaturedProduct
        featuredProduct={featuredProduct}
        onAddFeaturedProductToCart={addFeaturedProductToCart}
      />

      {/* Featured product details */}
      <FeaturedProductDetails
        featuredProduct={featuredProduct}
        filterSettings={filterSettings}
        onChangeFilter={setFilterSettingsHandler}
      />

      {/* Product list */}
      <ProductList products={productsPerPage} />
    </div>
  );
}

export default App;
