const cliProgress = require("cli-progress");

const paginator = async (
  Model,
  query = {},
  { limit = 100, lean = false, showProgress = true, maxItems = null, offset = 0 } = {},
  callback
) => {
  let currentOffset = offset;
  let computed = offset;
  let nbTotalItems = maxItems || 100000000;

  // create a new progress bar instance and use shades_classic theme
  const progressBar = showProgress
    ? new cliProgress.SingleBar({ stopOnComplete: true }, cliProgress.Presets.shades_classic)
    : null;
  progressBar?.start(nbTotalItems, 0);

  while (computed < nbTotalItems) {
    let { docs, total } = await Model.paginate(query, { offset: currentOffset, limit, lean });
    if (nbTotalItems === 100000000) {
      nbTotalItems = maxItems || total;
      progressBar?.setTotal(nbTotalItems);
    }

    await Promise.all(
      docs.map(async (item) => {
        computed += 1;
        await callback(item);
      })
    );
    currentOffset += limit;
    progressBar?.update(computed);
  }
};

module.exports.paginator = paginator;
