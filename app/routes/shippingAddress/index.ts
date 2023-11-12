import { paramObjId } from './../profile/schema'
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { IAuth, Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import { Schema } from 'mongoose'
import ShippingAddressController from '../../controllers/ShippingAddressController'
import { shippingAddressCreateSchema } from './schema'
import { IShippingAddress } from '../../models/ShippingAddress.Model'

const shippingAddressRoute = Router()

//---------------------------------------------
shippingAddressRoute.use(authenticate, checkRole(Role.USER), authorization)
//---------------------------------------------

shippingAddressRoute.post(
  '/create',
  validator(shippingAddressCreateSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const shippingAddresses = await ShippingAddressController.getAllByUserId(
      user._id as unknown as Schema.Types.ObjectId
    )

    // user can't able to create more then 3 shipping address
    if (shippingAddresses.length === 3)
      return response.badRequest('User not able to create more then 3 shipping address')

    const shippingAddressData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      division: req.body.division,
      district: req.body.district,
      thana: req.body.thana,
      address: req.body.address,
      user: user._id,
      // if first time create a shipping address then make it default
      isDefault: shippingAddresses?.length > 0 ? false : true
    }

    const shippingAddress = await ShippingAddressController.create(shippingAddressData as IShippingAddress)
    if (!shippingAddress?._id) return response.badRequest("Shipping address couldn't be created")

    return response.success(shippingAddress)
  })
)

shippingAddressRoute.get(
  '/get-all-user-shippingAddress',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const shippingAddresses = await ShippingAddressController.getAllByUserId(
      user._id as unknown as Schema.Types.ObjectId
    )
    response.success(shippingAddresses)
  })
)

shippingAddressRoute.put(
  '/make-default/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const shippingAddressId = req.params.id as unknown as Schema.Types.ObjectId
    const currentShippingAddress = await ShippingAddressController.findShippingAddressById(shippingAddressId)
    if (!currentShippingAddress?._id) return response.notFound('Shipping address not found')

    // FETCH ALL ADDRESS
    const shippingAddressList = await ShippingAddressController.getAllByUserId(
      user._id as unknown as Schema.Types.ObjectId
    )

    if (shippingAddressList.length) {
      // FIND OLD DEFAULT ONE & MAKE IT DEFAULT FALSE
      const oldDefaultShippingAddress = shippingAddressList.find((address) => address.isDefault)

      if (oldDefaultShippingAddress?._id) {
        const oldShippingAddress = await ShippingAddressController.findShippingAddressById(
          oldDefaultShippingAddress._id
        )

        if (!oldShippingAddress?._id) return response.badRequest("Couldn't update old on not default")
        oldShippingAddress.isDefault = false
        oldShippingAddress?.save()
      }
    }

    currentShippingAddress.isDefault = true
    currentShippingAddress.save()

    if (!currentShippingAddress.isDefault) return response.badRequest("Shipping address couldn't be updated")
    return response.success(currentShippingAddress)
  })
)

shippingAddressRoute.delete(
  '/delete/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    //FIND ADDRESS
    const shippingAddressId = req.params.id as unknown as Schema.Types.ObjectId
    const shippingAddress = await ShippingAddressController.findShippingAddressById(shippingAddressId)
    if (!shippingAddress?._id) return response.notFound('Shipping address not found')

    //IF DELETE ABLE ADDRESS IS DEFAULT THEN MAKE ANOTHER ONE DEFAULT BEFORE DELETE THE DEFAULT ONE
    if (shippingAddress.isDefault) {
      const shippingAddressList = await ShippingAddressController.getAllByUserId(
        user._id as unknown as Schema.Types.ObjectId
      )
      // MAKE ANOTHER ONE DEFAULT ADDRESS
      const othersAddresses = shippingAddressList.filter((address) => !address.isDefault)

      if (othersAddresses.length > 0) {
        const newDefaultAddress = await ShippingAddressController.findShippingAddressById(othersAddresses[0]._id)
        if (!newDefaultAddress?._id) return response.badRequest('Not found another shipping address to make default')
        newDefaultAddress.isDefault = true
        newDefaultAddress.save()
      }
    }

    //DELETE
    const deletedShippingAddress = await ShippingAddressController.delete(shippingAddress?._id)
    if (!deletedShippingAddress?._id) return response.badRequest("Shipping address couldn't be deleted")

    return response.success(deletedShippingAddress)
  })
)

export default shippingAddressRoute
