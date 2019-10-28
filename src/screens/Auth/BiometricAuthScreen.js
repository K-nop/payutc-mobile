/*
 * @author Arthur Martello <arthur.martello@etu.utc.fr>
 *
 * @copyright Copyright (c) 2019, SiMDE-UTC
 * @license GPL-3.0
 */

import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import BiometricAuth from '../../services/BiometricAuth';
import colors from '../../styles/colors';
import { Config, PayUTC } from '../../redux/actions';
import BlockTemplate from '../../components/BlockTemplate';
import { BiometricAuth as t } from '../../utils/i18n';
import ModalContainerView from '../../components/Modal/ModalContainerView';
import MessageModalChildren from '../../components/Modal/MessageModalChildren';

class BiometricAuthScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.androidModal = React.createRef();
	}

	componentDidMount() {
		this.next();
	}

	next() {
		const { navigation, restrictions } = this.props;

		const success = () => {
			navigation.navigate('Home');
		};

		if (BiometricAuth.isActionRestricted(restrictions, 'app-opening')) {
			this.androidModal.open();
			BiometricAuth.authenticate(success, () => {});
		} else {
			success();
		}
	}

	signOut() {
		const { navigation, dispatch } = this.props;

		PayUTC.forget().payload.then(() => {
			navigation.navigate('Auth');

			dispatch(Config.wipe());
		});
	}

	render() {
		return (
			<ModalContainerView
				style={{
					flex: 1,
					justifyContent: 'center',
					backgroundColor: colors.background,
					paddingHorizontal: 30,
				}}
				ref={ref => (this.androidModal = ref)}
				modalChildren={
					<MessageModalChildren title={t('title')} message={t('default_message')}>
						<FontAwesomeIcon
							icon={['fa', 'fingerprint']}
							size={75}
							style={{ color: colors.secondary, marginTop: 15, alignSelf: 'center' }}
						/>
					</MessageModalChildren>
				}
			>
				<FontAwesomeIcon
					icon={['fa', 'lock']}
					size={75}
					style={{ color: colors.primary, marginBottom: 45, alignSelf: 'center' }}
				/>

				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					onPress={() => this.next()}
					style={{ paddingVertical: 15 }}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
						<FontAwesomeIcon
							icon={['fa', 'fingerprint']}
							size={25}
							style={{ color: colors.secondary }}
						/>
						<Text
							style={{
								marginLeft: 15,
								fontSize: 15,
								fontWeight: 'bold',
								color: colors.secondary,
							}}
						>
							{t('retry')}
						</Text>
					</View>
				</BlockTemplate>

				<View style={{ height: 15 }} />

				<BlockTemplate
					roundedTop
					roundedBottom
					shadow
					onPress={() => this.signOut()}
					style={{ paddingVertical: 15 }}
				>
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
						<FontAwesomeIcon icon={['fa', 'times']} size={25} style={{ color: colors.secondary }} />

						<View style={{ flexDirection: 'column', paddingLeft: 15 }}>
							<Text
								style={{
									fontSize: 15,
									fontWeight: 'bold',
									color: colors.secondary,
								}}
							>
								{t('disable')}
							</Text>
							<Text
								style={{
									fontSize: 13,
									color: colors.secondary,
								}}
							>
								{t('disable_desc')}
							</Text>
						</View>
					</View>
				</BlockTemplate>
			</ModalContainerView>
		);
	}
}

const mapStateToProps = ({ config: { restrictions } }) => ({ restrictions });

export default connect(mapStateToProps)(BiometricAuthScreen);
