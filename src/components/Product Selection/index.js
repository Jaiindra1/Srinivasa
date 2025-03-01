@media (max-width: 480px) {
    .container {
        max-width: 80vw;
        margin: 40px auto;
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    }
    .receipt-container {
        overflow-x: auto;
    }

    table {
        min-width: 80px; /* Ensures the table remains scrollable */
    }

    th, td {
        font-size: 38%;
        padding: 7px;
    }

    .discount-input {
        width: 80px;
        padding: 5px;
        font-size: 14px;
    }
    .item-list{
        font-size: 10px;
    }
    .heading{
        font-size: 20px;
    }
    .form-submit{
        width: 20px;
    }
    .form-submit:disabled {
        background: #46f082;
        cursor: not-allowed;
        width: 39%;
        font-size: 92%;
        padding: 10px;
        margin-left: 15px;
    }
}
