import React, {useState} from 'react';
import Sweet from 'sweetalert2';
import ClienteAxios from '../config/axios';

const Orden = (props) => {
  
  const [cantidades, setCantidades] = useState(1);
  const [amount, setAmount] = useState('');
  const direccionDefault = props.user.address;
  const [direccionActual, setDireccionActual] = useState(0);
  let valor = parseInt(cantidades*props.platoID.price);     
  
  
  const onChangeCantidadHandler = (e) => {
    let cantidad = e.target.value;
    setCantidades(cantidad);
  } 
  
  const DireccionHandler = (e) => {
    let direccion = e.target.value;
    setDireccionActual(direccion);
  }

  const amountTopayHandler = (e) => {
    let amountTopayValor = e.target.value;
    setAmount(amountTopayValor);
  }

  const sumbitHandler = async (e) => {
    e.preventDefault();
    try {
      if (amount < valor || amount === 0 || amount === '') {
        await Sweet.fire({
          icon: 'error',
          title: 'El monto ingresado no puede:',
          html: 'Ser menor que el Total a pagar <br> o <br> Quedar vacio',
        });  
        return
      }
      await ClienteAxios.post(`/api/v1/orden`, { food: props.platoID._id, quantity: cantidades, address: direccionActual !== 0 ? direccionActual : direccionDefault, amountTopay: valor, user: props.user._id, state: 'Pendiente' });
      await Sweet.fire({
        icon: 'success',
        title: 'Tu pedido está en proceso',
        text: `Tu vuelto es de $${ amount - valor }`
      });
    } catch (err) {
      const { response } = err;
      const errores = response.data.mensaje;
    }
  }

  return (
    
    <div className="modal fade text-dark" id="OrdenModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle"> Plato elegido: { props.platoID.title }</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true text-dark">&times;</span>
            </button>
          </div>
          <div className="modal-body col px-0">
            <form className="d-flex flex-column px-3">
              <label>Unidades</label>
              <input type="number" min="1" className="my-1 form-control" name="quantity" placeholder="Cantidad" value={ cantidades } onChange={ onChangeCantidadHandler }/>
              <label>¿Con cuánto vas a abonar?</label>
              <div class="input-group mb-1">
                <div class="input-group-prepend">
                  <span class="input-group-text my-1">$</span>
                </div>
                <input type="text" class="my-1 form-control" onChange={amountTopayHandler} name="amountTopay" aria-label="Amount (to the nearest dollar)" />
              </div>
              <label>¿A dónde enviamos tu Pedido?</label>
              <input type="text" className="my-1 form-control" placeholder="Dirección" value={ direccionActual !== 0 ? direccionActual : direccionDefault } onChange={ DireccionHandler }/>
            </form>
            <div className="px-3">
            <p className="my-1 font-weight-bold">Total a pagar: ${ valor } </p>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={sumbitHandler}>Confirmar</button>
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Orden;