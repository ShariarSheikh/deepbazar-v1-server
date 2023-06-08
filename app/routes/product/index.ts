import createRoutes from './create'
import deleteRoutes from './delete'
import detailsRoutes from './details'
import listRoutes from './list'
import searchRoutes from './search'
import updateRoutes from './update'

//----------------------------------

//----------------------------------
const productRoutes = { createRoutes, listRoutes, detailsRoutes, deleteRoutes, updateRoutes, searchRoutes }

export default productRoutes
