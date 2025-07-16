import styles from "../../styles/styles";
import { Country, State } from "country-state-city";

const ShippingInfo = ({ user, form, setForm, userInfo, setUserInfo,phoneNumber }) => {

      const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <input type="text" value={user?.name || ""} disabled className={`${styles.input} !w-[50%] mr-2`} />
          <input type="email" value={user?.email || ""} disabled className={`${styles.input} !w-[50%]`} />
        </div>

        <div className="w-full flex pb-3">
          <input type="number" value={user?.phoneNumber || phoneNumber}  className={`${styles.input} !w-[50%] mr-2`} placeholder="phone" />
          <input type="number" name="zipCode" value={form.zipCode} onChange={handleChange} className={`${styles.input} !w-[50%]`} placeholder="zipCode" />
        </div>

        <div className="w-full flex pb-3">
          <select name="country" value={form.country} onChange={handleChange} className="w-[50%] border h-[40px] rounded-[5px] mr-2">
            <option value="">Choose your country</option>
            {Country.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
          <select name="city" value={form.city} onChange={handleChange} className="w-[50%] border h-[40px] rounded-[5px]">
            <option value="">Choose your city</option>
            {State.getStatesOfCountry(form.country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="w-full flex pb-3">
          <input type="text" name="address1" value={form.address1} onChange={handleChange} className={`${styles.input} !w-[50%] mr-2`}  placeholder="address1"/>

        </div>
      </form>

      <h5 className="text-[18px] cursor-pointer inline-block" onClick={() => setUserInfo(!userInfo)}>
        Choose From saved address
      </h5>
      {userInfo && user?.addresses?.map((item, idx) => (
        <div key={idx} className="flex mt-1">
          <input
            type="checkbox"
            className="mr-3"
            onClick={() =>
              setForm({
                address1: item.address1,
                address2: item.address2,
                zipCode: item.zipCode,
                country: item.country,
                city: item.city,
              })
            }
          />
          <h2>{item.addressType}</h2>
        </div>
      ))}
    </div>
  );
}

export default ShippingInfo