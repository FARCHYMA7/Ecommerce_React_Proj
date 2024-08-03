/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Container, Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge } from "reactstrap";
import DataTable from 'react-data-table-component';
import { useEffect, useState } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useDeleteAdminUserMutation, useGetUsersQuery } from "../../redux/api/userAPI";

const Users = () => {
    const paginationRowsPerPageOptions = [15, 30, 50, 100];
    const { data: userData, isLoading, refetch } = useGetUsersQuery();
    const [deleteAdminUser, { isLoading: deleteLoading, isSuccess: deleteSuccess, error, isError, data }] = useDeleteAdminUserMutation();
    const navigate = useNavigate();
    const [modalVisibility, setModalVisibility] = useState({ visible: false, userId: null });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderImage = (row) => {
        if (row.avatar) {
            return <img src={row.avatar} alt="user" className="img-fluid p-2" style={{ height: '50px', width: 'auto' }} />;
        }
        return (<></>);
    };

    const renderRole = (row) => {
        let badgeColor;
        switch (row.role.toLowerCase()) {
            case 'admin':
                badgeColor = 'danger';
                break;
            case 'user':
                badgeColor = 'primary';
                break;
            default:
                badgeColor = 'secondary';
        }
        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={badgeColor} className="px-2 py-1">
                    {row.role.toUpperCase()}
                </Badge>
            </span>
        );
    };

    const renderStatus = (row) => {
        let badgeColor;
        switch (row.status.toLowerCase()) {
            case 'active':
                badgeColor = 'success';
                break;
            case 'deleted':
                badgeColor = 'danger';
                break;
            default:
                badgeColor = 'secondary';
        }
        return (
            <span className="text-truncate text-capitalize align-middle">
                <Badge color={badgeColor} className="px-2 py-1">
                    {row.status.toUpperCase()}
                </Badge>
            </span>
        );
    };

    useEffect(() => {
        if (deleteSuccess) {
            toast.success(data?.message);
            navigate('/admin/users');
        }

        if (isError) {
            const errorMessage = typeof error.data === 'string' ? error.data : error.data?.message;
            toast.error(errorMessage || 'An unknown error occurred', {
                position: 'top-right',
            });
        }
    }, [deleteLoading, deleteSuccess, isError, error, data, navigate]);

    const handleDeleteUser = (id) => {
        deleteAdminUser(id);
        setModalVisibility({ visible: false, userId: null });
    };

    const columns = [
        {
            name: '',
            selector: (row) => renderImage(row),
        },
        {
            name: 'Firstname',
            selector: row => row.firstname,
            sortable: true
        },
        {
            name: 'Lastname',
            selector: row => row.lastname,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => renderRole(row),
        },
        {
            name: 'Status',
            selector: row => renderStatus(row),
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => (
                <>
                    {row.role !== 'admin' && (
                        <UncontrolledDropdown>
                            <DropdownToggle tag="div" className="btn btn-sm">
                                <MoreVertical size={14} className="cursor-pointer action-btn" />
                            </DropdownToggle>
                            <DropdownMenu end container="body">
                                <DropdownItem className="w-100" onClick={() => navigate(`/admin/users/update-user/${row._id}`)}>
                                    <Archive size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Edit</span>
                                </DropdownItem>
                                <DropdownItem className="w-100" onClick={() => setModalVisibility({ visible: true, userId: row._id })}>
                                    <Trash2 size={14} className="mr-50" />
                                    <span className="align-middle mx-2">Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="main-board">
                    <Container>
                        <Row className="mb-3">
                            <Col>
                                <a href="/admin/users/create-user" className="btn btn-outline-secondary">Create User</a>
                            </Col>
                        </Row>
                        <DataTable
                            title="Users"
                            data={userData.users}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                        />
                    </Container>
                </div>
            )}

            <Modal isOpen={modalVisibility.visible} toggle={() => setModalVisibility({ visible: false, userId: null })}>
                <ModalHeader toggle={() => setModalVisibility({ visible: false, userId: null })}>Confirm Delete?</ModalHeader>
                <ModalBody>Are you sure you want to delete?</ModalBody>
                <ModalFooter className="justify-content-start">
                    <Button color="danger" onClick={() => handleDeleteUser(modalVisibility.userId)}>
                        Yes
                    </Button>
                    <Button color="secondary" onClick={() => setModalVisibility({ visible: false, userId: null })} outline>
                        No
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default Users;
