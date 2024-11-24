export interface Categoria {
    categoriaId: number;
    nome: string;
    descricao: string;
}

export interface Book {
    bookId: number;
    nome: string;
    autor: string;
    isbn: number;
    paginas: number;
    restantes: number;
    qtdEmprestimos?: number;
    dataAdd?: Date;
    imagem?: string | null;
    categoria: Categoria;
}

export interface Client {
    clientId: number;
    clientCpf: string;
    clientNome: string;
}