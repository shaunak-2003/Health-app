const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Food_entriesDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const food_entries = await db.food_entries.create(
      {
        id: data.id || undefined,

        calorie_count: data.calorie_count || null,
        fat_content: data.fat_content || null,
        protein_content: data.protein_content || null,
        carbohydrate_content: data.carbohydrate_content || null,
        entry_date: data.entry_date || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await food_entries.setUser(data.user || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.food_entries.getTableName(),
        belongsToColumn: 'food_image',
        belongsToId: food_entries.id,
      },
      data.food_image,
      options,
    );

    return food_entries;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const food_entriesData = data.map((item, index) => ({
      id: item.id || undefined,

      calorie_count: item.calorie_count || null,
      fat_content: item.fat_content || null,
      protein_content: item.protein_content || null,
      carbohydrate_content: item.carbohydrate_content || null,
      entry_date: item.entry_date || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const food_entries = await db.food_entries.bulkCreate(food_entriesData, {
      transaction,
    });

    // For each item created, replace relation files

    for (let i = 0; i < food_entries.length; i++) {
      await FileDBApi.replaceRelationFiles(
        {
          belongsTo: db.food_entries.getTableName(),
          belongsToColumn: 'food_image',
          belongsToId: food_entries[i].id,
        },
        data[i].food_image,
        options,
      );
    }

    return food_entries;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const food_entries = await db.food_entries.findByPk(
      id,
      {},
      { transaction },
    );

    await food_entries.update(
      {
        calorie_count: data.calorie_count || null,
        fat_content: data.fat_content || null,
        protein_content: data.protein_content || null,
        carbohydrate_content: data.carbohydrate_content || null,
        entry_date: data.entry_date || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await food_entries.setUser(data.user || null, {
      transaction,
    });

    await FileDBApi.replaceRelationFiles(
      {
        belongsTo: db.food_entries.getTableName(),
        belongsToColumn: 'food_image',
        belongsToId: food_entries.id,
      },
      data.food_image,
      options,
    );

    return food_entries;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const food_entries = await db.food_entries.findByPk(id, options);

    await food_entries.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await food_entries.destroy({
      transaction,
    });

    return food_entries;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const food_entries = await db.food_entries.findOne(
      { where },
      { transaction },
    );

    if (!food_entries) {
      return food_entries;
    }

    const output = food_entries.get({ plain: true });

    output.food_image = await food_entries.getFood_image({
      transaction,
    });

    output.user = await food_entries.getUser({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.users,
        as: 'user',
      },

      {
        model: db.file,
        as: 'food_image',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.calorie_countRange) {
        const [start, end] = filter.calorie_countRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            calorie_count: {
              ...where.calorie_count,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            calorie_count: {
              ...where.calorie_count,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.fat_contentRange) {
        const [start, end] = filter.fat_contentRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            fat_content: {
              ...where.fat_content,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            fat_content: {
              ...where.fat_content,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.protein_contentRange) {
        const [start, end] = filter.protein_contentRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            protein_content: {
              ...where.protein_content,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            protein_content: {
              ...where.protein_content,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.carbohydrate_contentRange) {
        const [start, end] = filter.carbohydrate_contentRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            carbohydrate_content: {
              ...where.carbohydrate_content,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            carbohydrate_content: {
              ...where.carbohydrate_content,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.entry_dateRange) {
        const [start, end] = filter.entry_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            entry_date: {
              ...where.entry_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            entry_date: {
              ...where.entry_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.food_entries.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.food_entries.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('food_entries', 'entry_date', query),
        ],
      };
    }

    const records = await db.food_entries.findAll({
      attributes: ['id', 'entry_date'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['entry_date', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.entry_date,
    }));
  }
};
