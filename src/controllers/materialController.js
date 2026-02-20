const db = require('../config/database');

async function page(req, res) {
  const [materials, products, recipes] = await Promise.all([
    db('raw_materials').select('*').orderBy('name'),
    db('products').select('*').orderBy('name'),
    db('product_recipes as pr')
      .join('products as p', 'pr.product_id', 'p.id')
      .join('raw_materials as rm', 'pr.raw_material_id', 'rm.id')
      .select('pr.*', 'p.name as product_name', 'rm.name as material_name'),
  ]);
  const lowStock = materials.filter((item) => Number(item.stock) <= Number(item.min_stock));
  res.render('materials/index', { user: req.session.user, materials, products, recipes, lowStock });
}

async function createMaterial(req, res) {
  await db('raw_materials').insert(req.body);
  res.redirect('/materials');
}

async function createRecipe(req, res) {
  await db('product_recipes').insert(req.body);
  res.redirect('/materials');
}

module.exports = { page, createMaterial, createRecipe };
