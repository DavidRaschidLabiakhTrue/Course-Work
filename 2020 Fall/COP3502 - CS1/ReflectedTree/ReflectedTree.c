
#include <stdlib.h>
#include "UnlistedClassHeaderDueToLegalReasons.h"
#define TRUE  1
#define FALSE 0
typedef struct nodus
{
	int nodus_data;
	struct nodus *next_nodus;
}nodus;
typedef struct cmp_Q
{
	nodus *head;
	nodus *tail;
}cmp_Q;

int     isReflection(node *a, node *b);
node   *makeReflection(node *root);
int     kindredSpirits(node *a, node *b);
int     control_kindredspirit(node *tr_root_a, node *tr_root_b);
int     check_member_two(nodus *nodus_ref, node *tr_root_b);
int     postorder_traversal_and_comparison(nodus **nodus_ref, node *tr_root_b);
node   *build_node(int data);
nodus  *make_nodus_data(int root_a_data);
cmp_Q  *initialize_cmp_Q(void);
cmp_Q  *preorder_traversal_and_loading(cmp_Q *cmp_Q_ref, node *tr_root_a);
cmp_Q  *load_member_one(cmp_Q *cmp_Q_ref, node *tr_root_a);
cmp_Q  *end_cmp_Q(cmp_Q *cmp_Q_ref);
int isReflection(node *a, node *b)
{
	if (a == NULL & b == NULL)
	{	return TRUE;	}
	if ((a != NULL & b == NULL)|
		(b != NULL & a == NULL) )
	{	return FALSE;	}
	if (a->data == b->data                      &
		isReflection(a->left, b->right) == TRUE &
		isReflection(a->right, b->left) == TRUE  )
	{	return TRUE;	}
	return FALSE;
}

node *makeReflection(node *root)
{
	node *simulacrum  = NULL;
	if (root == NULL)
	{	return NULL;	}
	simulacrum        = build_node(root->data);
	simulacrum->left  = makeReflection(root->right);
	simulacrum->right = makeReflection(root->left);
	return simulacrum;
}

node *build_node(int data)
{
	node *a_node = calloc(1, sizeof(node));
	a_node->data = data;
	return a_node;
}

int kindredSpirits(node *a, node *b)
{
	if (a == NULL & b == NULL)
	{	return TRUE;	}
	if ((a != NULL & b == NULL)|
		(b != NULL & a == NULL) )
	{	return FALSE;	}
	return control_kindredspirit(a, b) | control_kindredspirit(b, a);
}

int control_kindredspirit(node *tr_root_a, node *tr_root_b)
{
	cmp_Q *cmp_Q_ref = NULL;
	nodus *nodus_ref = NULL;
	int state;
	cmp_Q_ref        = preorder_traversal_and_loading(cmp_Q_ref, tr_root_a);
	nodus_ref        = cmp_Q_ref->head;
	if (cmp_Q_ref->tail->nodus_data != tr_root_b->data)
	{
		cmp_Q_ref = end_cmp_Q(cmp_Q_ref);
		return FALSE;
	}
	state = postorder_traversal_and_comparison(&nodus_ref, tr_root_b);
	cmp_Q_ref = end_cmp_Q(cmp_Q_ref);
	return state;
}
nodus *make_nodus_data(int root_a_data)
{
	nodus *a_nodus      = calloc(1, sizeof(nodus));
	a_nodus->nodus_data = root_a_data;
	return a_nodus;
}

cmp_Q *initialize_cmp_Q(void)
{	return calloc(1, sizeof(cmp_Q));	}

cmp_Q *preorder_traversal_and_loading(cmp_Q *cmp_Q_ref, node *tr_root_a)
{
	if (tr_root_a == NULL)
	{	return NULL;	}
	cmp_Q_ref = load_member_one(cmp_Q_ref, tr_root_a);
	preorder_traversal_and_loading(cmp_Q_ref, tr_root_a->left);
	preorder_traversal_and_loading(cmp_Q_ref, tr_root_a->right);
	return cmp_Q_ref;
}
int postorder_traversal_and_comparison(nodus **nodus_ref, node *tr_root_b)
{
	if (tr_root_b == NULL)
	{	return TRUE;	}
	if (postorder_traversal_and_comparison(nodus_ref, tr_root_b->left) == TRUE &
		postorder_traversal_and_comparison(nodus_ref, tr_root_b->right) == TRUE  )
	{
		if ((*nodus_ref)->nodus_data == tr_root_b->data)
		{
			*nodus_ref = (*nodus_ref)->next_nodus;
			return TRUE;
		}
	}
	return FALSE;
}

cmp_Q *load_member_one(cmp_Q *cmp_Q_ref, node *tr_root_a)
{

	if (cmp_Q_ref == NULL || cmp_Q_ref->head == NULL)
	{
		if ((cmp_Q_ref	     = initialize_cmp_Q()) 			     == NULL  |
			(cmp_Q_ref->head = make_nodus_data(tr_root_a->data)) == NULL   )
		{	return end_cmp_Q(cmp_Q_ref);	}
		cmp_Q_ref->tail = cmp_Q_ref->head;
		return cmp_Q_ref;
	}
	if ( (cmp_Q_ref->tail->next_nodus = make_nodus_data(tr_root_a->data)) == NULL)
	{	return end_cmp_Q(cmp_Q_ref);	}
	cmp_Q_ref->tail = cmp_Q_ref->tail->next_nodus;
	return cmp_Q_ref;
}

cmp_Q *end_cmp_Q(cmp_Q *cmp_Q_ref)
{
	nodus *KILL = NULL;
	nodus *NEXT = NULL;
	if (cmp_Q_ref == NULL)
	{	return cmp_Q_ref;}
	KILL = cmp_Q_ref->head;
	while (KILL != NULL)
	{
		NEXT = KILL->next_nodus;
		free(KILL);
		KILL = NEXT;
	}
	free(cmp_Q_ref);
	return NULL;
}
