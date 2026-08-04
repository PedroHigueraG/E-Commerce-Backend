import {Product} from "../models";

const findById = async (id) => {
    const product = await Product.findByPk(id);

    // TODO: review error propagation
    if (!product) throw new Error(`Product ${id} not found`);

    return product;
}

export default {
    findById,
}