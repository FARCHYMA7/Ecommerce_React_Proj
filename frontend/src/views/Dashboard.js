/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Container, Row, Card, CardBody, Input, Label } from "reactstrap";
import { Search } from 'react-feather';
import logoImg from '../assets/img/logo.png';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productAPI";
import { useGetSearchProductMutation } from "../redux/api/homeAPI";

const Dashboard = () => {
    const [searchItem, setSearchItem] = useState('');
    const [visibleProductCount, setVisibleProductCount] = useState(8);
    const [productList, setProductList] = useState([]);
    const [getSearchProduct] = useGetSearchProductMutation();

    const initialResolutionData = [
        { key: 'HDMI', checked: false },
        { key: '2K', checked: false },
        { key: '4K', checked: false },
        { key: '8K', checked: false },
    ];

    const initialSizeData = [
        { key: '40”', checked: false },
        { key: '45”', checked: false },
        { key: '50”', checked: false },
        { key: '55”', checked: false },
        { key: '60”', checked: false },
        { key: '65”', checked: false },
        { key: '70”', checked: false },
        { key: '75”', checked: false },
    ];
    const [selectedResolution, setSelectedResolution] = useState([]);
    const [resolutions, setResolutions] = useState(initialResolutionData);
    const [selectedSize, setSelectedSize] = useState([]);
    const [sizes, setSizes] = useState(initialSizeData);

    const queryParams = {
        resolutions: selectedResolution,
        searchItem: searchItem,
        sizes: selectedSize
    };
    const { data: productData, isLoading, refetch } = useGetProductsQuery(queryParams);

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (productData && productData.products) {
            setProductList(productData.products);
        }
    }, [productData]);

    const handleSearchChange = (e) => {
        setSearchItem(e.target.value);
    };

    // Event handler for Enter key up in the input field
    const handleKeyUp = async (event) => {
        if (event.key === 'Enter') {
            if (searchItem) {
                queryParams.searchItem = searchItem;
            }
            const { data } = await getSearchProduct(queryParams)
            setProductList(data);

        }
    };

    // Event handler for search button click
    const handleSearchClick = async () => {
        if (searchItem) {
            queryParams.searchItem = searchItem;
        }
        const { data } = await getSearchProduct(queryParams)
        setProductList(data);
    };

    const handleResolutionChange = (e) => {
        const { id, checked } = e.target;
        if (checked) {
            setSelectedResolution([...selectedResolution, id]);
        } else {
            setSelectedResolution(selectedResolution.filter((t) => t !== id));
        }
        const updatedData = resolutions.map((item) => {
            if (item.key === id) {
                return { ...item, checked };
            }
            return item;
        });
        setResolutions(updatedData);
    };

    const handleSizeChange = (e) => {
        const { id, checked } = e.target;
        if (checked) {
            setSelectedSize([...selectedSize, id]);
        } else {
            setSelectedSize(selectedSize.filter((t) => t !== id));
        }
        const updatedData = sizes.map((item) => {
            if (item.key === id) {
                return { ...item, checked };
            }
            return item;
        });
        setSizes(updatedData);
    };

    const handleClearFilter = () => {
        setSearchItem('');
        setSelectedResolution([]);
        setSelectedSize([]);
        setResolutions(initialResolutionData);
        setSizes(initialSizeData);
    };


    return (
        <div className="board">
            <div className="search-board">
                <Container>
                    <div className="text-center search-board-style">
                        <div className="search-title">
                            Welcome to Our TV Shop
                        </div>
                        <div className="my-2">
                            <small className="search-subtitle">
                                Find the best TVs from top brands.
                            </small>
                        </div>

                        <div className="search-input-group d-flex justify-content-center mt-3">
                            <input
                                type="text"
                                name="productSearch"
                                autoComplete="off"
                                placeholder="Search TV"
                                className="form-control search-input"
                                value={searchItem}
                                onChange={handleSearchChange}
                                onKeyUp={handleKeyUp} // Attach the key up handler here
                            />
                            <button className="btn btn-shop-primary" type="button" style={{ borderRadius: '0px 5px 5px 0px' }} onClick={handleSearchClick} >
                                <Search size={30} />
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
            <div className="product-board mt-5">
                <Container>
                    <Row>
                        <Col md={3}>
                            <Card>
                                <CardBody>
                                    <div className="resolution">
                                        <h6 className="filter-title">Resolution</h6>
                                        <ul className="list-unstyled resolution-list">
                                            {resolutions.map((resolution, index) => (
                                                <li key={index}>
                                                    <div className="form-check">
                                                        <Input type="checkbox" id={resolution.key} checked={resolution.checked} onChange={handleResolutionChange} />
                                                        <Label className="form-check-label" for={resolution.key}>{resolution.key}</Label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="size">
                                        <h6 className="filter-title">Screen Size</h6>
                                        <ul className="list-unstyled size-list">
                                            {sizes.map((size, index) => (
                                                <li key={index}>
                                                    <div className="form-check">
                                                        <Input type="checkbox" id={size.key} checked={size.checked} onChange={handleSizeChange} />
                                                        <Label className="form-check-label" for={size.key}>{size.key}</Label>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div id="clear-filters">
                                        <Button color="outline-primary" block onClick={handleClearFilter}>
                                            Clear Filter
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md={9}>
                            <Row>
                                {!isLoading && (
                                    productList.length > 0 ? (
                                        <>
                                            {productList.slice(0, visibleProductCount).map((product, index) => (
                                                <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-4 d-flex">
                                                    <div className="product-card overflow-hidden flex-fill d-flex flex-column">
                                                        <Link to={`/products/review/${product._id}`}>
                                                            <div className="a-section a-spacing-base flex-fill d-flex flex-column">
                                                                <div className="aok-relative text-center s-image-overlay-grey puis-image-overlay-grey s-padding-left-small s-padding-right-small puis-spacing-small" style={{ paddingTop: "0px !important" }}>
                                                                    <div className="a-section aok-relative s-image-square-aspect">
                                                                        <img className="s-image" src={product.productImg || logoImg} alt="" />
                                                                    </div>
                                                                </div>
                                                                <div className="mt-3 flex-grow-1 d-flex flex-column">
                                                                    <div className="product-content flex-fill">
                                                                        <h5 className="text-center product-title" style={{ fontWeight: 'bold' }}>{product.name}</h5>
                                                                        <p className="text-center product-description">
                                                                            {product.detail.length > 120 ? `${product.detail.substring(0, 100)}...` : product.detail}
                                                                        </p>
                                                                        <div className="text-center my-1 product-price" style={{ color: '#2c3e50', fontWeight: 'bold' }}>
                                                                            <span style={{ fontSize: '1.2rem' }}>${product.price}</span>
                                                                        </div>
                                                                        <div className="text-center my-1 product-stock">
                                                                            {product.stock > 0 ?
                                                                                (<span style={{ fontSize: '0.9rem', color: '#27ae60', fontWeight: 'bold' }}>In Stock: {product.stock}</span>)
                                                                                : (<span style={{ fontSize: '0.9rem', color: '#e74c3c', fontWeight: 'bold' }}>Out of Stock</span>)
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>

                                                    </div>
                                                </Col>
                                            ))}
                                            {productList.length > visibleProductCount && (
                                                <div className="my-3 d-flex justify-content-center">
                                                    <Button
                                                        color='primary'
                                                        size='sm'
                                                        className="my-2"
                                                        onClick={() => setVisibleProductCount(visibleProductCount + 8)}
                                                    >
                                                        Load More
                                                    </Button>
                                                </div>

                                            )}
                                        </>
                                    ) : (
                                        <Col xs={12} className="text-center">
                                            <div className="empty-product-image">
                                                <img src={logoImg} alt="No Products Found" />
                                            </div>
                                            <p>No products found.</p>
                                        </Col>
                                    )
                                )}

                            </Row>
                        </Col>
                    </Row>

                </Container>
            </div>
        </div>

    )
}

export default Dashboard;