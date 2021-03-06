import React, { MouseEvent, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/client';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useHistory } from 'react-router-dom';
import Loader from '../components/loader';
import { LIST_POSTS, ListPosts, PostAuthor, Post } from '../graphql/post.queries';
import { DELETE_POST, DeletePostInput, DeletePostResult } from '../graphql/post.mutations';

const styles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

interface Column {
  id: keyof Post;
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any) => string;
}

const columns: Column[] = [
  { id: 'title', label: 'Title', minWidth: 170 },
  {
    id: 'author',
    label: 'Author',
    minWidth: 100,
    align: 'right',
    format: (value: PostAuthor) => `${value.username} ${value.fullname && `(${value.fullname})`}`,
  },
  {
    id: 'updatedAt',
    label: 'Updated at',
    minWidth: 170,
    align: 'right',
    format: (value) => new Date(Number(value)).toLocaleString(),
  },
  {
    id: 'createdAt',
    label: 'Created at',
    minWidth: 170,
    align: 'right',
    format: (value) => new Date(Number(value)).toLocaleString(),
  },
];

export default function PostsListPage() {
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [anchorEl, setAnchorEl] = useState<null | Element>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const isPostMenuOpen = anchorEl !== null;
  const classes = styles();
  const history = useHistory();

  const { data, loading, fetchMore, refetch } = useQuery<ListPosts, { limit?: number; page?: number }>(LIST_POSTS, {
    variables: { limit: rowsPerPage },
  });

  const [deletePost] = useMutation<DeletePostResult, DeletePostInput>(DELETE_POST);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>, postId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(postId);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
    setSelectedPost(null);
  };

  const handleClickOpenDialog = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    handleCloseUserMenu();
    if (!selectedPost) {
      return;
    }
    await deletePost({ variables: { postId: selectedPost } });
    await refetch();
    handleCloseDialog();
  };

  const handleEditPost = () => {
    history.push(`/post/edit/${selectedPost}`);
  };

  const handleChangePage = async (event: unknown, newPage: number) => {
    return fetchMore({
      variables: { limit: rowsPerPage, page: newPage + 1 },
    });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    return fetchMore({
      variables: { limit: +event.target.value, page: 1 },
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (!data) {
    return <h2>Something went wrong</h2>;
  }

  return (
    <Paper className={classes.content}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align}>
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="right" width="80px" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.listPosts.items.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={`${column.id}-${row.id}`} align={column.align}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell align="right">
                    <IconButton onClick={(event) => handleOpenUserMenu(event, row.id)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.listPosts.totalItems}
        rowsPerPage={rowsPerPage}
        page={data.listPosts.page - 1}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isPostMenuOpen}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={handleEditPost}>Edit post</MenuItem>
        <MenuItem onClick={handleClickOpenDialog}>Delete post</MenuItem>
      </Menu>
      <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={openDialog}>
        <DialogTitle id="customized-dialog-title">Delete post</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>This post will be deleted permanently. This action is irreversible!</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDeletePost} color="primary">
            Confirm
          </Button>
          <Button autoFocus onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
